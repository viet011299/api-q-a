/**
 * Section.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: "string"
    },
    date:{
      type:"string"
    },
    auth_id: {
      type: "integer"
    },
    content: {
      type: "string"
    },
    topic_id:{
      type: "integer"
    },
    open: {
      type: "boolean"
    }
  },connection: 'someMysqlServer'
};

