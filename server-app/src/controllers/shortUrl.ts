import express from "express";
import { urlModal } from "../modal/shortUrl";

export const createUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { fullUrl } = req.body;
    const urlFound = await urlModal.find({ fullUrl });
    if (urlFound.length > 0) {
      res.status(409);
      res.send(`URL already exists: ${urlFound}`);
    } else {
      const shortUrl = await urlModal.create({ fullUrl });
      res.status(201).send(shortUrl);
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const getAllUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrls = await urlModal.find();
    if (shortUrls.length < 0) {
      res.status(404).send({ message: "No URL found!" });
    } else {
      res.status(200).send(shortUrls);
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const getUrl = async (req: express.Request, res: express.Response) => {
  try {
    const shortUrl = await urlModal.findOne({ _id: req.params.id });
    if (!shortUrl) {
      res.status(404).send("No Url Found!");
    } else {
      shortUrl.clicks++;
      shortUrl.save();
      res.redirect(`${shortUrl.fullUrl}`);
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
  }
};

export const deleteUrl = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const shortUrl = await urlModal.findByIdAndDelete({ _id: req.params.id });
    if (shortUrl) {
      res.status(200).send("URL deleted Successfully!");
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong!" });
  }
};
