const mazeGrid = document.getElementById('mazeGrid');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const generateBtn = document.getElementById('generateBtn');
const sampleBtn = document.getElementById('sampleBtn');
const resetBtn = document.getElementById('resetBtn');
const bfsBtn = document.getElementById('bfsBtn');
const dfsBtn = document.getElementById('dfsBtn');

const algorithmValue = document.getElementById('algorithmValue');
const visitedValue = document.getElementById('visitedValue');
const pathValue = document.getElementById('pathValue');
const statusText = document.getElementById('status');

let rows = 6;
let cols = 8;
let grid = [];

let startPos = null;
let endPos = null;
let isSolving = false;

function initGrid() {
    rows = parseInt(rowsInput.value) || 6;
    cols = parseInt(colsInput.value) || 8;

    // Limits
    rows = Math.min(Math.max(rows, 3), 15);
    cols = Math.min(Math.max(cols, 3), 15);
    rowsInput.value = rows;
    colsInput.value = cols;

    mazeGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    mazeGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    mazeGrid.innerHTML = '';
    grid = [];
    startPos = null;
    endPos = null;

    for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
            rowArr.push({ type: 'open', element: null });
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.r = r;
            cell.dataset.c = c;

            cell.addEventListener('mousedown', (e) => {
                // simple cycle on left click
                if (e.button === 0) handleCellClick(r, c);
            });
            mazeGrid.appendChild(cell);
            rowArr[c].element = cell;
        }
        grid.push(rowArr);
    }

    // Default start and end
    setCellType(0, 0, 'start');
    setCellType(rows - 1, cols - 1, 'end');

    resetResults();
}

function handleCellClick(r, c) {
    if (isSolving) return;

    const currentType = grid[r][c].type;
    let nextType = 'open';

    if (currentType === 'open') nextType = 'wall';
    else if (currentType === 'wall') {
        if (!startPos) nextType = 'start';
        else if (!endPos) nextType = 'end';
        else nextType = 'open';
    }
    else if (currentType === 'start') nextType = 'end';
    else if (currentType === 'end') nextType = 'open';

    setCellType(r, c, nextType);
    clearPath(); // clear existing visual path if user edits grid
}

function setCellType(r, c, type) {
    const cellData = grid[r][c];
    const el = cellData.element;

    el.classList.remove('wall', 'start', 'end');

    if (cellData.type === 'start') startPos = null;
    if (cellData.type === 'end') endPos = null;

    if (type === 'start') {
        if (startPos) {
            grid[startPos.r][startPos.c].type = 'open';
            grid[startPos.r][startPos.c].element.classList.remove('start');
        }
        startPos = { r, c };
    } else if (type === 'end') {
        if (endPos) {
            grid[endPos.r][endPos.c].type = 'open';
            grid[endPos.r][endPos.c].element.classList.remove('end');
        }
        endPos = { r, c };
    }

    cellData.type = type;
    if (type !== 'open') {
        el.classList.add(type);
    }
}

function loadSample() {
    rowsInput.value = 8;
    colsInput.value = 10;
    initGrid();

    // Sample maze
    const sampleWalls = [
        [0, 1], [0, 3], [1, 3], [1, 5], [1, 7], [1, 8],
        [2, 1], [2, 5], [3, 1], [3, 2], [3, 3], [3, 5], [3, 7],
        [4, 5], [4, 7], [5, 1], [5, 3], [5, 4], [5, 5], [5, 7], [5, 8],
        [6, 1], [6, 9], [7, 3], [7, 4], [7, 5], [7, 7]
    ];

    for (let w of sampleWalls) {
        if (w[0] < rows && w[1] < cols) {
            setCellType(w[0], w[1], 'wall');
        }
    }

    setCellType(0, 0, 'start');
    setCellType(7, 9, 'end');
}

function clearPath() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const el = grid[r][c].element;
            el.classList.remove('visited', 'path');
        }
    }
    resetResults();
}

function resetResults() {
    algorithmValue.textContent = '-';
    visitedValue.textContent = '-';
    pathValue.textContent = '-';
    statusText.textContent = 'Generate or load a maze, then choose BFS or DFS.';
    statusText.style.color = 'var(--text-muted)';
}

async function solveMaze(algorithm) {
    if (isSolving) return;
    if (!startPos || !endPos) {
        statusText.textContent = 'Error: Maze requires exactly 1 Start and 1 End point.';
        statusText.style.color = '#ef4444';
        return;
    }

    clearPath();
    isSolving = true;
    algorithmValue.textContent = algorithm.toUpperCase();
    statusText.textContent = `Solving with ${algorithm.toUpperCase()}...`;
    statusText.style.color = 'var(--accent)';
    visitedValue.textContent = '0';

    const result = algorithm === 'bfs' ? solveBFS() : solveDFS();

    // Animation execution
    for (let i = 0; i < result.visitedOrder.length; i++) {
        const { r, c } = result.visitedOrder[i];
        if ((r !== startPos.r || c !== startPos.c) && (r !== endPos.r || c !== endPos.c)) {
            grid[r][c].element.classList.add('visited');
        }
        visitedValue.textContent = i + 1;
        await new Promise(res => setTimeout(res, 20)); // animation speed
    }

    if (result.path) {
        pathValue.textContent = result.path.length;
        statusText.textContent = `Path found! (${result.path.length} steps)`;
        statusText.style.color = '#10b981';

        for (let i = result.path.length - 1; i >= 0; i--) {
            const { r, c } = result.path[i];
            if ((r !== startPos.r || c !== startPos.c) && (r !== endPos.r || c !== endPos.c)) {
                grid[r][c].element.classList.add('path');
            }
            await new Promise(res => setTimeout(res, 35));
        }
    } else {
        pathValue.textContent = 'None';
        statusText.textContent = 'No path found. The end is unreachable.';
        statusText.style.color = '#ef4444';
    }

    isSolving = false;
}

function getNeighbors(r, c) {
    const neighbors = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, Down, Left, Right

    for (let [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].type !== 'wall') {
            neighbors.push({ r: nr, c: nc });
        }
    }
    return neighbors;
}

function solveBFS() {
    const queue = [{ r: startPos.r, c: startPos.c }];
    const visited = new Set([`${startPos.r},${startPos.c}`]);
    const parentMap = {};
    const visitedOrder = [];
    let queueIdx = 0;

    while (queueIdx < queue.length) {
        const current = queue[queueIdx++];

        if (current.r !== startPos.r || current.c !== startPos.c) {
            visitedOrder.push(current);
        }

        if (current.r === endPos.r && current.c === endPos.c) {
            return { visitedOrder, path: reconstructPath(parentMap) };
        }

        const neighbors = getNeighbors(current.r, current.c);
        for (let next of neighbors) {
            const key = `${next.r},${next.c}`;
            if (!visited.has(key)) {
                visited.add(key);
                parentMap[key] = `${current.r},${current.c}`;
                queue.push(next);
            }
        }
    }
    return { visitedOrder, path: null };
}

function solveDFS() {
    const stack = [{ r: startPos.r, c: startPos.c, pKey: null }];
    const visited = new Set();
    const parentMap = {};
    const visitedOrder = [];

    while (stack.length > 0) {
        const current = stack.pop();
        const key = `${current.r},${current.c}`;

        if (visited.has(key)) continue;
        visited.add(key);

        if (current.pKey) {
            parentMap[key] = current.pKey;
        }

        if (current.r !== startPos.r || current.c !== startPos.c) {
            visitedOrder.push(current);
        }

        if (current.r === endPos.r && current.c === endPos.c) {
            return { visitedOrder, path: reconstructPath(parentMap) };
        }

        const neighbors = getNeighbors(current.r, current.c);
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const next = neighbors[i];
            const nextKey = `${next.r},${next.c}`;
            if (!visited.has(nextKey)) {
                stack.push({ r: next.r, c: next.c, pKey: key });
            }
        }
    }
    return { visitedOrder, path: null };
}

function reconstructPath(parentMap) {
    let current = `${endPos.r},${endPos.c}`;
    const path = [];
    while (current !== `${startPos.r},${startPos.c}`) {
        current = parentMap[current];
        if (!current) return null;
        const [r, c] = current.split(',').map(Number);
        path.push({ r, c });
    }
    path.pop(); // Remove start visualization
    return path;
}

// Bind Events
generateBtn.addEventListener('click', initGrid);
sampleBtn.addEventListener('click', loadSample);
resetBtn.addEventListener('click', clearPath);
bfsBtn.addEventListener('click', () => solveMaze('bfs'));
dfsBtn.addEventListener('click', () => solveMaze('dfs'));

// Run on load
initGrid();
