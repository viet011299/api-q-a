/**
 * Question.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
 
  attributes: {
    content: {
      type: "string"
    },
    section_id: {
      type: "integer"
    },
    date:{
      type:"string"
    },
    count_like:{
      type:"integer"
    },
    auth_Id:{
      type:"integer"
    }
  }
  // ,connection: 'monggodb'  
  , connection: 'someMysqlServer'
  
};

