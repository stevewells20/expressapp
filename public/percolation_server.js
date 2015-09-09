var Percolate = {

    draw: function(N,perc) {
        var canvas = document.getElementById('animation');
        var ctx = canvas.getContext('2d');
        var canvasSize = canvas.width; // = height because square canvas assumed
        var siteSize = Math.floor(canvasSize / N);
        var firstSiteLocation = (canvasSize - siteSize * N) / 2;  // Centering
        
        // Helper function to convert row/col nums to grid locations
        function loc(coordinate) {
            return firstSiteLocation + (coordinate - 1) * siteSize
        }
        
        ctx.fillStyle="grey";
        ctx.fillRect(0,0,canvasSize,canvasSize);
        this.drawGrid = function() {
            for (var row = 1; row < N + 1; row++) {
                for (var col = 1; col < N + 1; col++) {
                    //switch?
                    if (perc.isFull(row, col)) {
                        ctx.fillStyle = "#6699FF"; // Full sites are blue
                        ctx.fillRect(loc(col), loc(row), siteSize, siteSize); 
                    } else if (perc.isOpen(row, col)) {
                        ctx.fillStyle = "white";  // Open sites are white
                        ctx.fillRect(loc(col), loc(row), siteSize, siteSize);
                    } else {
                        ctx.fillStyle = "black";  // Closed sites are black
                        ctx.fillRect(loc(col), loc(row), siteSize, siteSize);
                    } 
                }
            }
        }
    },

    // Main function.  Open sites randomly until percolation, calling draw with each open.
    simulatePercolation: function() {
        // Remove output from last run if it exists
        document.getElementById("percolates").innerHTML = "";
        clearInterval(interval);
        
        // User inputs.  The + forces the values to be numeric:
        var N = +document.getElementById("gridSize").value;
        //var N = gridSize;
        var radios = document.getElementsByName('speed');
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                if (radios[i].value == "instant") { var delay = 0; }
                else if (radios[i].value == "fast") { var delay = 10; }
                else if (radios[i].value == "slow") { var delay = 500; }
                break;
            }
        }

        // Creating instances of "classes"
        var perc = new Percolate.Percolation(N);
        var drawPerc = new Percolate.draw(N,perc);
        var count = 0; // Should output to screen when simulation is finished

        // Open a site uniformly at random within the grid
        function openRandom() {
            // Generate random integers between 1 and N
            var i = Math.floor(Math.random() * N + 1);
            var j = Math.floor(Math.random() * N + 1);

            if (perc.isOpen(i, j)) {
                openRandom();
            } else {
                perc.open(i, j);
                return;
            }
        }

        function syncDB(N,count,percentage){
            var doc = {
                "_id": "s"+Date.now(),
                "N": N,
                "count": count,
                "percentage": percentage,
                };

            localDB.put(doc);

            // localDB.upsert('stats', myDeltaFunction).then(function () {
            //     console.log('Success! \n\t'+doc._id+' was N-SYNCed')
            // }).catch(function (err) {
            //     if (err.status === 409) {
            //         console.log('Conflict in upsert: 409')}
            //     else {
            //         console.log('Some other error! \n\t'+err)
            //     }
            // });
            //
            //}
        }

        // Open random sites and re-draw grid until system percolates
        function checkPerc() {
            if (!perc.percolates()) {
                openRandom();
                count++;
                drawPerc.drawGrid();
            } else {
                clearInterval(interval);
                var percentage = parseFloat((count * 100) / (N * N)).toFixed(2);
                var outstring = "Total average of percolation: "+averageDB("percentage")+"%\nThe system percolates after opening " + count + 
                " sites. The percentage of open sites is " + percentage + "%";
                document.getElementById("percolates").innerHTML = outstring;
                syncDB(N,count,percentage);//
            }
        }

        // Runs a while loop until system percolates then outputs to screen
        function outputInstantly() {
            while (!perc.percolates()) {
                openRandom();
                count++;
            }
            drawPerc.drawGrid();
            var percentage = parseFloat((count * 100) / (N * N)).toFixed(2);
            var outstring = "The system percolates after opening " + count + 
            " sites. The percentage of open sites is " + percentage + "%";
            document.getElementById("percolates").innerHTML = outstring;
            syncDB(N,count,percentage)//
        }

        // If no delay, draw instantly.  Otherwise, draw with setInterval and delay
        if (delay === 0) {
            outputInstantly();
        } else {
            // Use setInterval to repeatedly call checkPerc until system percolates 
            interval = setInterval(checkPerc, delay);
            //interval();
        }
    },

    // Percolation system.  Grid begins closed with functions to open sites and check status
    Percolation: function(N) {
        // Constructor
        var size = N;
        var uf = new Percolate.WeightedQuickUnionUF(N * N + 2);
        var topUF = new Percolate.WeightedQuickUnionUF(N * N + 2);
        var opened = [];
        for (var i = 0; i < N * N; i++) {
            opened[i] = false;
        }

        // Helper function to convert 2 digit references to 1 digit
        function xyTo1D(i, j) {
            return size * (i - 1) + j;
        }

        // Open a new site in the grid
        this.open = function(i, j) {
            // Mark open in boolean array:
            opened[xyTo1D(i, j)] = true;
            
            // Connect with open neighbors:
            if (i != 1 && this.isOpen(i - 1, j)) {
                uf.union(xyTo1D(i, j), xyTo1D(i - 1, j));
                topUF.union(xyTo1D(i, j), xyTo1D(i - 1, j));
            }
            if (i != size && this.isOpen(i + 1, j)) {
                uf.union(xyTo1D(i, j), xyTo1D(i + 1, j));
                topUF.union(xyTo1D(i, j), xyTo1D(i + 1, j));
            }
            if (j != 1 && this.isOpen(i, j - 1)) {
                uf.union(xyTo1D(i, j), xyTo1D(i, j - 1));
                topUF.union(xyTo1D(i, j), xyTo1D(i, j - 1));
            }
            if (j != size && this.isOpen(i, j + 1)) {
                uf.union(xyTo1D(i, j), xyTo1D(i, j + 1));
                topUF.union(xyTo1D(i, j), xyTo1D(i, j + 1));
            }

            // If in top or bottom row, connect to virtual sites:
            if (i === 1) {
                uf.union(xyTo1D(i, j), 0);
                topUF.union(xyTo1D(i, j), 0);
            }
            if (i === size) {
                // Don't connect topUF.  Prevents backwash problem
                uf.union(xyTo1D(i, j), size * size + 1);
            }


        }
        
        this.isOpen = function(i, j) {
            return opened[xyTo1D(i, j)];
        }

        // A site is full if a path exists from it to the top
        this.isFull = function(i, j) {
            return topUF.connected(xyTo1D(i, j), 0);
        }

        // System percolates if top and bottom virtual sites are connected
        this.percolates = function() {
            return uf.connected(0, size * size + 1);
            return 0;
        }
    },

    // Union find implementation for efficient checking of percolation
    WeightedQuickUnionUF: function(N) {
        
        // Constructor
        var id = [];
        var sz = []; 
        for (var i = 0; i < N; i++) {
            id[i] = i; // id[i] = parent of i
            sz[i] = 1; // sz[i] = number of objects in subtree rooted at i
        }

        // Returns the number of components, which starts at N
        this.count = N;

        // Returns the component id for the component containing site
        this.find = function(p) {
            while (p != id[p]) {
                p = id[p];
            }
            return p;
        }

        // Returns true if two elements are part of the same component
        this.connected = function(p, q) {
            return this.find(p) === this.find(q);
        }

        // Connects the components of two elements
        this.union = function(p, q) {
            var rootP = this.find(p);
            var rootQ = this.find(q);
            if (rootP === rootQ) { return; }
            
            // make smaller root point to large one
            if (sz[rootP] < sz[rootQ]) {
                id[rootP] = rootQ; sz[rootQ] += sz[rootP];
            } else {
                id[rootQ] = rootP; sz[rootP] += sz[rootQ];
            }
            this.count--;
        }
    },

};


    



    