# Maze Solver

A C-based maze solver implementing **Depth-First Search (DFS)** and **Breadth-First Search (BFS)** algorithms with an interactive web-based visualizer. This is a Design and Analysis of Algorithms (DAA) mini project that demonstrates graph traversal techniques and compares their performance in solving mazes.

## Features

- **Two Pathfinding Algorithms**
  - **BFS**: Finds the shortest path from source to destination
  - **DFS**: Explores paths recursively, useful for understanding graph traversal

- **Interactive Web Visualizer**
  - Build custom grids with configurable dimensions
  - Visualize algorithm execution in real-time
  - Mark start (S), end (E), and walls (#) in the maze
  - View path solutions and statistics

- **C Backend**
  - Efficient maze solving algorithms
  - Maze file parsing and validation
  - Detailed statistics (path length, visited nodes)

- **File-based Input Support**
  - Read mazes from text files
  - Simple format: rows, columns, and grid layout

## Project Structure

```
Maze-Solver/
├── backend/
│   ├── main.c              # Command-line entry point
│   ├── maze_solver.c       # Algorithm implementations (BFS & DFS)
│   ├── maze_solver.h       # Header file with data structures
│   ├── test_maze.txt       # Sample maze input
│   └── maze_solver         # Compiled binary
├── frontend/
│   ├── index.html          # Web UI structure
│   ├── script.js           # Visualization logic
│   └── style.css           # Styling and layout
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- **C Compiler** (gcc, clang, or similar)
- **Web Browser** (for the visualizer)
- Make (optional, for building)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Compile the C code:
```bash
gcc -o maze_solver maze_solver.c main.c
```

3. Run with a maze file:
```bash
./maze_solver < test_maze.txt
```

### Frontend Setup

1. Open `frontend/index.html` in your web browser, or
2. Serve locally using a simple HTTP server:
```bash
cd frontend
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

## Maze Input Format

Mazes are provided as text files with the following format:

```
<rows> <cols>
<row1>
<row2>
...
```

**Cell Types:**
- `S` - Start position
- `E` - End/goal position
- `#` - Wall (impassable)
- `.` - Open space (passable)

**Example:**
```
5 5
S . # . .
. . . . .
# # # . #
. . . . .
. . # . E
```

## Algorithm Comparison

### BFS (Breadth-First Search)
- **Guarantees**: Shortest path
- **Time Complexity**: O(V + E) where V = vertices, E = edges
- **Space Complexity**: O(V) for queue storage
- **Best for**: Finding shortest distance between two points

### DFS (Depth-First Search)
- **Guarantees**: Path existence (but not necessarily shortest)
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) for recursion stack
- **Best for**: Exploring all reachable cells, memory-efficient with backtracking

## Usage Examples

### Using the Web Visualizer

1. Click **"Generate Grid"** to create a new maze
2. Click cells to toggle walls or set start/end points
3. Click **"Solve with BFS"** or **"Solve with DFS"** to run the algorithm
4. View the solution path, visited nodes count, and path length

### Using the CLI

```bash
# Solve a maze from a file
./maze_solver < test_maze.txt

# Output shows:
# - Whether a path was found
# - Number of visited nodes
# - Path length
```

## Data Structures

### Maze
```c
typedef struct {
  int rows;
  int cols;
  char cells[MAX_ROWS][MAX_COLS];
  Point start;
  Point end;
} Maze;
```

### SolveResult
```c
typedef struct {
  int pathFound;
  int visitedNodes;
  int pathLength;
} SolveResult;
```

## Limitations

- Maximum grid size: 100x100
- Single start and end point per maze
- Supports 4-directional movement (up, down, left, right)

## Future Enhancements

- [ ] Support for 8-directional movement (including diagonals)
- [ ] Weighted maze cells with Dijkstra's algorithm
- [ ] A* algorithm for heuristic-based pathfinding
- [ ] Performance benchmarking tools
- [ ] Multiple start/end points

## License

See [LICENSE](LICENSE) file for details.

## Author

Created as a Design and Analysis of Algorithms (DAA) mini project.

---

**Note**: This project is educational and demonstrates fundamental graph algorithms. For production use, consider optimizations and additional features based on specific requirements.
