/**
 * Gaussian eliminatino by itsravenous
 * https://github.com/itsravenous/gaussian-elimination
 */
var abs = Math.abs;
var count = function (a) {
    return a.length;
}
var array_fill = function (i, n, v) {
    var a = [];
    for (var i = 0; i < n; i++) {
        a.push(v)
    }
    return a;
}

/**
 * Gaussian elimination
 * @param  array $A matrix
 * @param  array $x vector
 * @return array    solution vector
 */
function gauss($A, $x) {
    // Just make a single matrix
    for ($i=0; $i < count($A); $i++) { 
        $A[$i].push($x[$i]);
    }
    $n = count($A);

    for ($i=0; $i < $n; $i++) { 
        // Search for maximum in this column
        $maxEl = abs($A[$i][$i]);
        $maxRow = $i;
        for ($k=$i+1; $k < $n; $k++) { 
            if (abs($A[$k][$i]) > $maxEl) {
                $maxEl = abs($A[$k][$i]);
                $maxRow = $k;
            }
        }


        // Swap maximum row with current row (column by column)
        for ($k=$i; $k < $n+1; $k++) { 
            $tmp = $A[$maxRow][$k];
            $A[$maxRow][$k] = $A[$i][$k];
            $A[$i][$k] = $tmp;
        }

        // Make all rows below this one 0 in current column
        for ($k=$i+1; $k < $n; $k++) { 
            $c = -$A[$k][$i]/$A[$i][$i];
            for ($j=$i; $j < $n+1; $j++) { 
                if ($i==$j) {
                    $A[$k][$j] = 0;
                } else {
                    $A[$k][$j] += $c * $A[$i][$j];
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix $A
    $x = array_fill(0, $n, 0);
    for ($i=$n-1; $i > -1; $i--) { 
        $x[$i] = $A[$i][$n]/$A[$i][$i];
        for ($k=$i-1; $k > -1; $k--) { 
            $A[$k][$n] -= $A[$k][$i] * $x[$i];
        }
    }

    return $x;
}

if (typeof module != "undefined")
	module.exports = gauss;
