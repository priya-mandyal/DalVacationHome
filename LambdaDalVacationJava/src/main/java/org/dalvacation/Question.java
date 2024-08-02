package org.dalvacation;

public class Question {

    public Question(Long id,String question) {
        this.id = id;
        this.question = question;
    }

    public Question() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private Long id;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    private String question;

}
