public class StringReverser {
    public static String reverseHello() {
        String input = "Hello";
        StringBuilder reversed = new StringBuilder();
        for (int i = input.length() - 1; i >= 0; i--) {
            reversed.append(input.charAt(i));
        }
        return reversed.toString();
    }

    public static void main(String[] args) {
        String reversedString = reverseHello();
        System.out.println(reversedString);
    }
}