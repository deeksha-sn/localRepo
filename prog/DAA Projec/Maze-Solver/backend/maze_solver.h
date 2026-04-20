#ifndef MAZE_SOLVER_H
#define MAZE_SOLVER_H

#include <stdio.h>

#define MAX_ROWS 100
#define MAX_COLS 100
#define MAX_CELLS (MAX_ROWS * MAX_COLS)

typedef struct {
  int row;
  int col;
} Point;

typedef struct {
  int rows;
  int cols;
  char cells[MAX_ROWS][MAX_COLS];
  Point start;
  Point end;
} Maze;

typedef struct {
  int pathFound;
  int visitedNodes;
  int pathLength;
} SolveResult;

int is_dimensions_valid(int rows, int cols);
int is_cell_valid(const Maze *maze, int row, int col);
int read_maze(FILE *input, Maze *maze);
void print_maze(const Maze *maze);
int find_special_points(const Maze *maze, Point *start, Point *end);

SolveResult solve_maze_bfs(Maze *maze);
SolveResult solve_maze_dfs(Maze *maze);

#endif
