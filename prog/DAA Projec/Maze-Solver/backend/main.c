#include "maze_solver.h"
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  Maze maze;

  printf("Enter number of rows and columns: ");
  if (scanf("%d %d", &maze.rows, &maze.cols) != 2) {
    printf("Error: Invalid input for dimensions.\n");
    return 1;
  }

  if (!is_dimensions_valid(maze.rows, maze.cols)) {
    printf("Error: Invalid dimensions. Dimensions must be between 1 and %d.\n",
           MAX_ROWS);
    return 1;
  }

  printf("Enter the maze ('S' for start, 'E' for end, '#' for wall, '.' for "
         "open path):\n");
  if (!read_maze(stdin, &maze)) {
    printf("Error: Failed to read maze.\n");
    return 1;
  }

  if (!find_special_points(&maze, &maze.start, &maze.end)) {
    printf(
        "Error: Maze must have exactly one Start ('S') and one End ('E').\n");
    return 1;
  }

  printf("\nOriginal Maze:\n");
  print_maze(&maze);

  // Make a copy of the maze for BFS to keep original intact for DFS
  Maze maze_bfs = maze;
  printf("\nSolving with Breadth-First Search (BFS):\n");
  SolveResult result_bfs = solve_maze_bfs(&maze_bfs);

  if (result_bfs.pathFound) {
    printf("BFS Path found! Length: %d, Nodes Visited: %d\n",
           result_bfs.pathLength, result_bfs.visitedNodes);
    print_maze(&maze_bfs);
  } else {
    printf("BFS: No path found.\n");
  }

  // Make a copy of the maze for DFS
  Maze maze_dfs = maze;
  printf("\nSolving with Depth-First Search (DFS):\n");
  SolveResult result_dfs = solve_maze_dfs(&maze_dfs);

  if (result_dfs.pathFound) {
    printf("DFS Path found! Length: %d, Nodes Visited: %d\n",
           result_dfs.pathLength, result_dfs.visitedNodes);
    print_maze(&maze_dfs);
  } else {
    printf("DFS: No path found.\n");
  }

  return 0;
}
