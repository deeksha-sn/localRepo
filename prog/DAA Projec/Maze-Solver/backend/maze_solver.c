#include "maze_solver.h"

typedef struct {
    Point data[MAX_CELLS];
    int front;
    int rear;
} Queue;

typedef struct {
    Point data[MAX_CELLS];
    int top;
} Stack;

static const int DIRECTIONS[4][2] = {
    {-1, 0},
    {1, 0},
    {0, -1},
    {0, 1}
};

static void init_queue(Queue *queue) {
    queue->front = 0;
    queue->rear = 0;
}

static int is_queue_empty(const Queue *queue) {
    return queue->front == queue->rear;
}

static void enqueue(Queue *queue, Point point) {
    if (queue->rear < MAX_CELLS) {
        queue->data[queue->rear++] = point;
    }
}

static Point dequeue(Queue *queue) {
    return queue->data[queue->front++];
}

static void init_stack(Stack *stack) {
    stack->top = -1;
}

static int is_stack_empty(const Stack *stack) {
    return stack->top < 0;
}

static void push(Stack *stack, Point point) {
    if (stack->top + 1 < MAX_CELLS) {
        stack->data[++stack->top] = point;
    }
}

static Point pop(Stack *stack) {
    return stack->data[stack->top--];
}

static void initialize_parent_map(Point parent[MAX_ROWS][MAX_COLS], int rows, int cols) {
    int row;
    int col;

    for (row = 0; row < rows; row++) {
        for (col = 0; col < cols; col++) {
            parent[row][col].row = -1;
            parent[row][col].col = -1;
        }
    }
}

static int build_path(Maze *maze, Point parent[MAX_ROWS][MAX_COLS]) {
    Point current = maze->end;
    int pathLength = 0;

    while (!(current.row == maze->start.row && current.col == maze->start.col)) {
        Point previous = parent[current.row][current.col];

        if (previous.row == -1 && previous.col == -1) {
            return 0;
        }

        if (!(current.row == maze->end.row && current.col == maze->end.col)) {
            maze->cells[current.row][current.col] = '*';
        }

        current = previous;
        pathLength++;
    }

    return pathLength;
}

int is_dimensions_valid(int rows, int cols) {
    return rows > 0 && rows <= MAX_ROWS && cols > 0 && cols <= MAX_COLS;
}

int is_cell_valid(const Maze *maze, int row, int col) {
    return row >= 0 &&
           row < maze->rows &&
           col >= 0 &&
           col < maze->cols &&
           maze->cells[row][col] != '#';
}

int read_maze(FILE *input, Maze *maze) {
    int row;
    int col;

    for (row = 0; row < maze->rows; row++) {
        for (col = 0; col < maze->cols; col++) {
            if (fscanf(input, " %c", &maze->cells[row][col]) != 1) {
                return 0;
            }
        }
    }

    return 1;
}

void print_maze(const Maze *maze) {
    int row;
    int col;

    for (row = 0; row < maze->rows; row++) {
        for (col = 0; col < maze->cols; col++) {
            printf("%c ", maze->cells[row][col]);
        }
        printf("\n");
    }
}

int find_special_points(const Maze *maze, Point *start, Point *end) {
    int row;
    int col;
    int startCount = 0;
    int endCount = 0;

    for (row = 0; row < maze->rows; row++) {
        for (col = 0; col < maze->cols; col++) {
            if (maze->cells[row][col] == 'S') {
                start->row = row;
                start->col = col;
                startCount++;
            } else if (maze->cells[row][col] == 'E') {
                end->row = row;
                end->col = col;
                endCount++;
            }
        }
    }

    return startCount == 1 && endCount == 1;
}

SolveResult solve_maze_bfs(Maze *maze) {
    int visited[MAX_ROWS][MAX_COLS] = {0};
    Point parent[MAX_ROWS][MAX_COLS];
    Queue queue;
    SolveResult result = {0, 0, 0};

    initialize_parent_map(parent, maze->rows, maze->cols);
    init_queue(&queue);

    enqueue(&queue, maze->start);
    visited[maze->start.row][maze->start.col] = 1;

    while (!is_queue_empty(&queue)) {
        Point current = dequeue(&queue);
        int directionIndex;

        result.visitedNodes++;

        if (current.row == maze->end.row && current.col == maze->end.col) {
            result.pathFound = 1;
            result.pathLength = build_path(maze, parent);
            return result;
        }

        for (directionIndex = 0; directionIndex < 4; directionIndex++) {
            int nextRow = current.row + DIRECTIONS[directionIndex][0];
            int nextCol = current.col + DIRECTIONS[directionIndex][1];

            if (is_cell_valid(maze, nextRow, nextCol) && !visited[nextRow][nextCol]) {
                visited[nextRow][nextCol] = 1;
                parent[nextRow][nextCol] = current;
                enqueue(&queue, (Point){nextRow, nextCol});
            }
        }
    }

    return result;
}

SolveResult solve_maze_dfs(Maze *maze) {
    int visited[MAX_ROWS][MAX_COLS] = {0};
    Point parent[MAX_ROWS][MAX_COLS];
    Stack stack;
    SolveResult result = {0, 0, 0};

    initialize_parent_map(parent, maze->rows, maze->cols);
    init_stack(&stack);
    push(&stack, maze->start);

    while (!is_stack_empty(&stack)) {
        Point current = pop(&stack);
        int directionIndex;

        if (visited[current.row][current.col]) {
            continue;
        }

        visited[current.row][current.col] = 1;
        result.visitedNodes++;

        if (current.row == maze->end.row && current.col == maze->end.col) {
            result.pathFound = 1;
            result.pathLength = build_path(maze, parent);
            return result;
        }

        for (directionIndex = 3; directionIndex >= 0; directionIndex--) {
            int nextRow = current.row + DIRECTIONS[directionIndex][0];
            int nextCol = current.col + DIRECTIONS[directionIndex][1];

            if (is_cell_valid(maze, nextRow, nextCol) && !visited[nextRow][nextCol]) {
                if (parent[nextRow][nextCol].row == -1 && parent[nextRow][nextCol].col == -1) {
                    parent[nextRow][nextCol] = current;
                }
                push(&stack, (Point){nextRow, nextCol});
            }
        }
    }

    return result;
}
