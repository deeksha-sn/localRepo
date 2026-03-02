public class ABC {
    int no = 100;

    void m1() {
        int no1 = 10;
        System.out.println(no + no1);

    }

    void m2() {
        int no2 = 20;
    }

    public static void main(String[] args) {
        ABC obj = new ABC();
        obj.m2();
    }
}
