/**
 * Questionsurvey.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    survery_id: {
      type: "integer"
    },
    content: {
      type: "string"
    },
    type: {
      type: "integer"
    }
  }, connection: 'someMysqlServer'
};

