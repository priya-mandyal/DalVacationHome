package org.dalvacation;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
        System.out.println(caesarCipher("AYZ",1));
    }

    public static String caesarCipher(String str, int shift) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char currentChar = str.charAt(i);
            if (currentChar >= 'A' && currentChar <= 'Z') {
                int currentCharPosition = currentChar - 'A';
                int newCharPosition = (currentCharPosition + shift) % 26;
                char newChar = (char) (newCharPosition + 'A');
                result.append(newChar);
            } else {
                result.append(currentChar); // Keep non-uppercase characters unchanged
            }
        }
        return result.toString();
    }
}
