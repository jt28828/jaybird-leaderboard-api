import { Response } from "express";

export class BaseController {

  /** sends an ok response to the requesting user */
  protected sendOkResponse(response: Response, object?: any) {
    response.status(200);
    BaseController.sendResponse(response, object);
  }

  /** sends a Created response to the requesting user */
  protected sendCreatedResponse(response: Response, object?: any) {
    response.status(201);
    BaseController.sendResponse(response, object);
  }

  /** sends a no content response to the requesting user */
  protected sendNoContentResponse(response: Response) {
    response.status(204);
    BaseController.sendResponse(response);
  }

  /** sends a BadRequest response to the requesting user */
  protected sendBadRequestResponse(response: Response, object?: any) {
    response.status(400);
    BaseController.sendResponse(response, object);
  }

  /** sends a NotFound response to the requesting user */
  protected sendNotFoundResponse(response: Response, object?: any) {
    response.status(404);
    BaseController.sendResponse(response, object);
  }

  /** sends a Conflict response to the requesting user */
  protected sendConflictResponse(response: Response, object?: any) {
    response.status(409);
    BaseController.sendResponse(response, object);
  }

  /** sends the response with or without data */
  private static sendResponse(response: Response, object?: any) {
    if (object != null) {
      response.send(object);
    } else {
      response.send();
    }
  }

}
