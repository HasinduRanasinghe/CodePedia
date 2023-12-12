public class ArmstrongNumberChecker {
    public static boolean is153ArmstrongNumber() {
        int number = 153;
        int originalNumber = number;
        int sum = 0;
        while (number != 0) {
            int digit = number % 10;
            sum += Math.pow(digit, 3);
            number /= 10;
        }
        return originalNumber == sum;
    }

    public static void main(String[] args) {
        boolean isArmstrong = is153ArmstrongNumber();
        System.out.println(isArmstrong);
    }
}
