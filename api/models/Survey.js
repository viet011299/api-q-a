/**
 * Survey.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    section_id: {
      type: "integer"
    },
    title: {
      type: "string"
    },
    auth_id:{
      type:"integer"
    },
    description:{
      type:"string"
    },
    open:{
      type:"boolean"
    },
    date:{
      type:"string"
    }
  },
   connection: 'someMysqlServer'
};

