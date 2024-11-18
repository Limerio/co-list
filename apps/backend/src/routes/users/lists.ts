import { Router } from "express";
import { z } from "zod";
import type { Context } from "../..";
import { validateMiddleware } from "../../middlewares/validate";
import { paramListIdValidator } from "../../validators";
import type { userParamId } from "../users";

const router = Router();

const createUserLists = z.object({
  body: z.object({
    name: z.string().min(3),
  }),
});

const getUserList = z.object({
  params: z.object({
    listId: paramListIdValidator,
  }),
});

const updateList = z.object({
  body: z.object({
    name: z.string().min(3),
  }),
});

export const listsRouter = ({ models: { ListModel } }: Context) => {
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
    .post("/", validateMiddleware(createUserLists), async (req, res) => {
      const { userId: owner } = req.params as z.infer<
        typeof userParamId
      >["params"];
      const { name } = req.body as z.infer<typeof createUserLists>["body"];

      const list = await ListModel.create({
        name,
        owner,
      });

      res.json(list);
    })
    .get("/:listId", validateMiddleware(getUserList), async (req, res) => {
      const { userId: owner, listId: _id } = req.params as z.infer<
        typeof getUserList & typeof userParamId
      >["params"];

      const list = await ListModel.findOne({
        _id,
        owner,
      });

      res.json(list);
    })
    .put(
      "/",
      validateMiddleware(getUserList.merge(updateList)),
      async (req, res) => {
        const { listId: _id, userId: owner } = req.params as z.infer<
          typeof getUserList & typeof userParamId
        >["params"];
        const { name } = req.body as z.infer<typeof updateList>["body"];

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
    .delete("/", validateMiddleware(getUserList), async (req, res) => {
      const { userId: owner, listId: _id } = req.params as z.infer<
        typeof userParamId & typeof getUserList
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
