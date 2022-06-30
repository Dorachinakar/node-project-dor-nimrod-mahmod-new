const visitCard = require("../models/visitCard");
const User = require("../models/user");

const mongoose = require("mongoose");

function getAllVisitCard() {
  return new Promise((resolve, reject) => {
    visitCard
      .find()
      .then((visitCard) => resolve(visitCard))
      .catch((err) => reject(err));
  });
}

function getById(_id) {
  return new Promise((resolve, reject) => {
    visitCard
      .findById(_id)

      .then((card) => resolve(card))
      .catch((err) => reject(err));
  });
}

function addCard(card, userId) {
  return new Promise(async (resolve, reject) => {
    const newCard = new visitCard(card);
    const { error, value } = newCard.validateCardSchema().validate(card);
    if (error) {
      reject(error.details[0].message);
    } else {
      const user = await User.findById(userId);
      newCard.user_id = userId;
      if (user.isVip) {
        await user.cards.push(newCard);
        await user.save();
        await newCard.save();
        resolve(newCard);
      } else {
        reject("this user is not a vip user");
      }
    }
  });
}

//bouns not done it
function updateCardId(cardId, newId, userId) {
  return new Promise(async (resolve, reject) => {
    const result = await checkCardId(newId);
    if (result === true) {
      let oldCard = await visitCard.findById(cardId);
      const id = newId[0]._id;
      let objid = mongoose.Types.ObjectId(id);
      const {
        likes,
        businessName,
        businessDiscribe,
        businessAdress,
        businessPhone,
        businessPicture,
        createdAt,
        updatedAt,
      } = oldCard;
      let newVisitCard = {
        _id: objid,
        likes,
        businessName,
        businessDiscribe,
        businessAdress,
        businessPhone,
        businessPicture,
        createdAt,
        updatedAt,
      };
      deleteCard(cardId, oldCard.user_id)
        .then()
        .catch((err) => reject(err));
      addCard(newVisitCard, oldCard.user_id)
        .then((card) => resolve(card))
        .catch((err) => reject(err));
    } else if (!result) {
      reject("id is all ready in use");
    } else {
      reject(result);
    }
  });
}
async function checkCardId(newId) {
  try {
    if (newId.length !== 24) {
      const card = await visitCard.findById(newId);
      if (card === null) {
        return true;
      } else {
        return false;
      }
    }
  } catch {
    return "errorId:id must be 24 letters";
  }
}

function getCardsFromUser(userId) {
  return new Promise(async (resolve, reject) => {
    User.findById(userId)
      .then((user) => resolve(user.cards))
      .catch((err) => reject(err));
  });
}
function editCardById(filter) {
  return new Promise(async (resolve, reject) => {
    const { userId, cardId } = filter;
    let user = await User.findById(userId);
    if (checkIsVip(user)) {
      visitCard
        .findById(cardId)
        .then((card) => resolve(card))
        .catch((err) => reject(err));
    } else {
      reject({ status: "failed", message: "u need to be a vip" });
    }
  });
}

function updateCardLikes(cardId, likes) {
  return new Promise(async (resolve, reject) => {
    try {
      const card = await visitCard.findById(cardId);
      const result = await checkIsID(likes);
      if (result || !result) {
        if (result) {
          card.likes = likes;
          card
            .save()
            .then((card) => resolve(card))
            .catch((err) => reject(err));
        } else
          reject("error:there is card with no user,check your inputs please");
      } else reject("errorId:id must be 24 letters");
    } catch (err) {
      reject("card id is not a valid id");
    }
  });
}
async function checkIsID(likes) {
  try {
    for (const like of likes) {
      let user = await User.findById(like._id);
      if (user === null) return false;
    }

    return true;
  } catch (err) {
    return err;
  }
}
function deleteCard(cardId, userId) {
  return new Promise(async (resolve, reject) => {
    let user = await User.findById(userId);
    if (checkIsVip(user) || checkIsAdmin(user)) {
      await deleteCardFromUser(cardId);
      visitCard
        .findOneAndDelete({ _id: cardId })
        .then((card) => resolve(card))
        .catch((err) => reject(err));
    } else reject({ status: "failed", message: "u need to be a vip" });
  });
}
async function deleteCardFromUser(_id) {
  let card = await visitCard.findById({ _id });
  let userId = card._doc.user_id;
  let user = await User.findById(userId);
  user.cards.forEach((card, index) => {
    if (card._id == _id) {
      user.cards.splice(index, 1);
      user.save();
    }
  });
}

function checkIsAdmin(user) {
  return user.isAdmin ? true : false;
}
function checkIsVip(user) {
  return user.isVip ? true : false;
}

module.exports = {
  getAllVisitCard,
  getById,
  addCard,
  getCardsFromUser,
  editCardById,
  deleteCard,
  updateCardLikes,
  updateCardId,
};
