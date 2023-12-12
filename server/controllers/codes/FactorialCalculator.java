public class FactorialCalculator {
    public static long calculateFactorialOf6() {
        int n = 6;
        long result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    public static void main(String[] args) {
        long factorial = calculateFactorialOf6();
        System.out.println(factorial);
    }
}