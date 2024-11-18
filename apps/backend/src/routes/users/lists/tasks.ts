import { Router } from "express";
import { z } from "zod";
import type { Context } from "../../..";
import { validateMiddleware } from "../../../middlewares/validate";
import { idValidator } from "../../../validators";
import type { userParamId } from "../../users";
import type { getUserListValidator } from "../lists";

const router = Router();

const createTaskValidator = z.object({
  body: z.object({
    content: z.string().min(3),
  }),
});

const getListsTaskValidator = z.object({
  params: z.object({
    taskId: idValidator,
  }),
});

const updateListsTaskValidator = z.object({
  body: z.object({
    content: z.string().min(1),
  }),
});

export const tasksListRouter = ({ models: { TaskModel } }: Context) => {
  router
    .get("/", async (req, res) => {
      const { userId: createdBy, listId: list } = req.params as z.infer<
        typeof userParamId & typeof getUserListValidator
      >["params"];

      const tasks = await TaskModel.find({
        list,
        createdBy,
      });

      if (!tasks) {
        res.sendStatus(404);
        return;
      }

      res.json(tasks);
    })
    .post("/", validateMiddleware(createTaskValidator), async (req, res) => {
      const { userId: createdBy, listId: list } = req.params as z.infer<
        typeof userParamId & typeof getUserListValidator
      >["params"];
      const { content } = req.body as z.infer<
        typeof createTaskValidator
      >["body"];

      const newTask = new TaskModel({
        content,
        list,
        createdBy,
      });

      await newTask.save();

      res.status(201).json(newTask);
    })
    .get("/:taskId", async (req, res) => {
      const {
        userId: createdBy,
        listId: list,
        taskId: _id,
      } = req.params as z.infer<
        typeof userParamId &
          typeof getUserListValidator &
          typeof getListsTaskValidator
      >["params"];

      const task = await TaskModel.findOne({
        _id,
        list,
        createdBy,
      });

      if (!task) {
        res.sendStatus(404);
        return;
      }

      res.json(task);
    })
    .put(
      "/:taskId",
      validateMiddleware(updateListsTaskValidator),
      async (req, res) => {
        const {
          userId: createdBy,
          listId: list,
          taskId: _id,
        } = req.params as z.infer<
          typeof userParamId &
            typeof getUserListValidator &
            typeof getListsTaskValidator
        >["params"];

        const { content } = req.body as z.infer<
          typeof updateListsTaskValidator
        >["body"];

        const task = await TaskModel.findOneAndUpdate(
          {
            _id,
            list,
            createdBy,
          },
          {
            content,
          }
        );

        if (!task) {
          res.sendStatus(404);
          return;
        }

        res.json(task);
      }
    )
    .delete("/:taskId", async (req, res) => {
      const {
        userId: createdBy,
        listId: list,
        taskId: _id,
      } = req.params as z.infer<
        typeof userParamId &
          typeof getUserListValidator &
          typeof getListsTaskValidator
      >["params"];

      const task = await TaskModel.findOneAndDelete({
        _id,
        list,
        createdBy,
      });

      if (!task) {
        res.sendStatus(404);
        return;
      }

      res.json(task);
    });

  return router;
};
