public class ArrayElementCounter {
    public static int countOccurrencesOf7() {
        int[] array = {7, 3, 7, 8, 7, 0};
        int element = 7;
        int count = 0;
        for (int item : array) {
            if (item == element) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int count = countOccurrencesOf7();
        System.out.println(count);
    }
}
