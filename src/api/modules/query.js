import merge from 'lodash.merge'
const testData = {message: 'hello'}

// These are generic methods used in the generic controllers for all models
export const controllers = {
  createOne(model, body) {
    console.log('createOne')
    return model.create(body);
  },

  updateOne(docToUpdate, update) {
    console.log('updateOne')
    merge(docToUpdate, update)
    return docToUpdate.save();
  },

  deleteOne(docToDelete) {
    console.log('deleteOne')
    return docToDelete.remove();
  },

  getOne(docToGet) {
    console.log('getOne')
    return Promise.resolve(docToGet)
  },

  getAll(model) {
    console.log('getAll')
    return model.find({})
  },

  findByParam(model, id) {
    console.log('findByParam')
    return model.findById(id);
  }
}

// POST THE_RESOURCE/ -> return HTTP 201 and the new instance created
export const createOne = (model) => (req, res, next) => {
  const newData = req.body;
  return controllers.createOne(model, newData)
      .then(mongoDoc => res.status(201).json(mongoDoc))
      .catch(error => next(error));
}

// PUT THE_RESOURCE/:id
// because of ... .param('id',..) we can access req.docFromId
export const updateOne = (model) => async (req, res, next) => {
  const docToUpdate = req.docFromId;
  const newData = req.body;

  return controllers.updateOne(docToUpdate, newData)
      .then(mongoDoc => res.status(201).json(mongoDoc))
      .catch(error => next(error));
}
// DELETE THE_RESOURCE/:id
// because of ... .param('id',..) we can access req.docFromId
export const deleteOne = (model) => (req, res, next) => {
  const docToDelete = req.docFromId;
  return controllers.deleteOne(docToDelete)
      .then(mongoDoc => res.status(201).json(mongoDoc))
      .catch(error => next(error));
}

// GET THE_RESOURCE/:id
// because of ... .param('id',..) we can access req.docFromId
export const getOne = (model) => (req, res, next) => {
  const docToGet = req.docFromId;
  // note that docToGet is already the document
  // but to be consistant, we pass it to the function getOne()
  // that suppose to only return docToGet
  return controllers.getOne(docToGet)
      .then(mongoDoc => res.status(200).json(mongoDoc))
      .catch(error => next(error));
}

// GET THE_RESOURCE/
export const getAll = (model) => (req, res, next) => {
  return controllers.getAll(model)
      .then(mongoDocs => res.json(mongoDocs))
      .catch(error => next(error))
}

export const findByParam = (model) => (req, res, next, id) => {
  console.log('findByParam:id', id);
  return controllers.findByParam(model, id)
      .then(doc => {
        if (!doc) {
          next(new Error('Not Found Error'));
        } else {
          req.docFromId = doc;
          next();
        }
      })
      .catch(error => {
        next(error);
      })
}


export const generateControllers = (model, overrides = {}) => {
  const defaults = {
    findByParam: findByParam(model),
    getAll: getAll(model),
    getOne: getOne(model),
    deleteOne: deleteOne(model),
    updateOne: updateOne(model),
    createOne: createOne(model)
  }

  return {...defaults, ...overrides}
}
