import { Router } from "express";
import { z } from "zod";
import type { Context } from "../..";
import { validateMiddleware } from "../../middlewares/validate";
import { idValidator } from "../../validators";
import type { userParamId } from "../users";
import { tasksListRouter } from "./lists/tasks";

const router = Router();

const createUserListsValidator = z.object({
  body: z.object({
    name: z.string().min(3),
  }),
});

export const getUserListValidator = z.object({
  params: z.object({
    listId: idValidator,
  }),
});

const updateListValidator = z.object({
  body: z.object({
    name: z.string().min(3),
  }),
});

export const listsRouter = (ctx: Context) => {
  const {
    models: { ListModel },
  } = ctx;

  router
    .get("/", async (req, res) => {
      const { userId: owner } = req.params as z.infer<
        typeof userParamId
      >["params"];

      const list = await ListModel.find({
        owner,
      });

      res.json(list);
    })
    .post(
      "/",
      validateMiddleware(createUserListsValidator),
      async (req, res) => {
        const { userId: owner } = req.params as z.infer<
          typeof userParamId
        >["params"];
        const { name } = req.body as z.infer<
          typeof createUserListsValidator
        >["body"];

        const list = await ListModel.create({
          name,
          owner,
        });

        res.json(list);
      }
    )
    .use(
      "/:listId/tasks",
      validateMiddleware(getUserListValidator),
      tasksListRouter(ctx)
    )
    .route("/:listId")
    .get(validateMiddleware(getUserListValidator), async (req, res) => {
      const { userId: owner, listId: _id } = req.params as z.infer<
        typeof getUserListValidator & typeof userParamId
      >["params"];

      const list = await ListModel.findOne({
        _id,
        owner,
      });

      res.json(list);
    })
    .put(
      validateMiddleware(getUserListValidator.merge(updateListValidator)),
      async (req, res) => {
        const { listId: _id, userId: owner } = req.params as z.infer<
          typeof getUserListValidator & typeof userParamId
        >["params"];
        const { name } = req.body as z.infer<
          typeof updateListValidator
        >["body"];

        const list = await ListModel.findOneAndUpdate(
          {
            _id,
            owner,
          },
          { name }
        );

        if (!list) {
          res.sendStatus(404);
          return;
        }

        res.json(list);
      }
    )
    .delete(validateMiddleware(getUserListValidator), async (req, res) => {
      const { userId: owner, listId: _id } = req.params as z.infer<
        typeof userParamId & typeof getUserListValidator
      >["params"];

      const list = await ListModel.findOneAndDelete({
        _id,
        owner,
      });

      if (!list) {
        res.sendStatus(404);
        return;
      }

      res.sendStatus(200);
    });

  return router;
};
