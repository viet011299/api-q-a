/**
 * Answer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    content: {
      type: "string"
    },
    idQuestion: {
      type: "integer"
    },
    date: {
      type:"string"
    },
    auth_Id:{
      type:"integer"
    },
    choose:{
      type:"boolean"
    }
  }

  , connection: 'someMysqlServer'
};

