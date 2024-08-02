package org.dalvacation;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.GetItemRequest;
import com.amazonaws.services.dynamodbv2.model.QueryRequest;
import com.amazonaws.services.dynamodbv2.model.QueryResult;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class GetUserQuestionHandler implements RequestHandler<UserQueryRequest, QuestionResponse> {

    private AmazonDynamoDB amazonDynamoDB;

    private final String USER_QUESTIONS_TABLE_NAME = "userquestions";
    private final String QUESTIONS_TABLE_NAME = "questions";
    private final Regions REGION = Regions.US_EAST_1;

    @Override
    public QuestionResponse handleRequest(UserQueryRequest userQueryRequest, Context context) {
        this.initDynamoDbClient();

        String questionId = getRandomQuestionId(userQueryRequest.username());
        if (questionId == null) {
            return new QuestionResponse("No questions found for the user", null, null);
        }

        String question = getQuestionById(questionId);
        return new QuestionResponse(null, Long.parseLong(questionId), question);
    }

    private void initDynamoDbClient() {
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard()
                .withRegion(REGION)
                .build();
    }

    private String getRandomQuestionId(String username) {
        Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
        expressionAttributeValues.put(":v_username", new AttributeValue().withS(username));

        QueryRequest queryRequest = new QueryRequest()
                .withTableName(USER_QUESTIONS_TABLE_NAME)
                .withKeyConditionExpression("username = :v_username")
                .withExpressionAttributeValues(expressionAttributeValues);

        QueryResult queryResult = amazonDynamoDB.query(queryRequest);

        List<Map<String, AttributeValue>> items = queryResult.getItems();
        if (items.isEmpty()) {
            return null;
        }

        Map<String, AttributeValue> item = items.get(0);
        List<AttributeValue> questions = item.get("questions").getL();
        if (questions.isEmpty()) {
            return null;
        }

        Random random = new Random();
        Map<String, AttributeValue> randomQuestion = questions.get(random.nextInt(questions.size())).getM();

        return randomQuestion.get("id").getN();
    }

    private String getQuestionById(String questionId) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("id", new AttributeValue().withN(questionId));

        GetItemRequest getItemRequest = new GetItemRequest()
                .withTableName(QUESTIONS_TABLE_NAME)
                .withKey(key);

        Map<String, AttributeValue> item = amazonDynamoDB.getItem(getItemRequest).getItem();
        if (item == null) {
            return null;
        }

        return item.get("question").getS();
    }
}

record UserQueryRequest(String username) {
}

class QuestionResponse {
    private String error;
    private Long id;
    private String question;

    public QuestionResponse(String error, Long id, String question) {
        this.error = error;
        this.id = id;
        this.question = question;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}