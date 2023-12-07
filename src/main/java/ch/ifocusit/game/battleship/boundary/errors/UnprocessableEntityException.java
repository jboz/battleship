package ch.ifocusit.game.battleship.boundary.errors;

import com.tietoevry.quarkus.resteasy.problem.HttpProblem;

public class UnprocessableEntityException extends HttpProblem {

    public UnprocessableEntityException(String message) {
        super(builder()
                .withStatus(422)
                .withTitle("Error during processing")
                .withDetail(message));
    }

}
