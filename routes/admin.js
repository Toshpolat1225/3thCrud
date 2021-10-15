const { Router } = require('express')
const router = Router()

const mongoose = require('mongoose')

const fileMiddleware = require("../middleware/file")

const Group = require('../models/Group')

const Teacher = require('../models/Teacher')

const Student = require('../models/Student')

const toDelete = require('../middleware/toDelete')

const adminController = require('../controller/adminController')


router.get('/', adminController.mainAdmin)


/* +++++++++++++++++++++++++++++++++++++++ Profile ++++++++++++++++++++++++++++++++++++++++++++++ */
router.get('/lookProfile', adminController.lookAdmin)

router.get('/editProfile/:id', adminController.editAdminGet)

router.post('/editProfile/:id', fileMiddleware.single("avatar"), adminController.editAdminPost)



/* +++++++++++++++++++++++++++++++++++++++ Groups ++++++++++++++++++++++++++++++++++++++++++++++ */

router.get('/groups', adminController.GroupsGet)

router.get('/groups/add', adminController.createGroupsGet)

router.get('/groups/:id', adminController.idGroupsGet)

router.get("/groups/edit/:id", adminController.editGroupsGet)

router.post('/groups/add', fileMiddleware.single("img"), adminController.createGroupsPost)

router.post("/groups/edit/:id", fileMiddleware.single("img"), adminController.editGroupsPost)

router.get("/groups/delete/:id", adminController.deleteGroupsGet)

/* +++++++++++++++++++++++++++++++++++++++ Groups ++++++++++++++++++++++++++++++++++++++++++++++ */

router.get('/teachers', adminController.TeachersGet)

router.get('/teachers/add', adminController.createTeachersGet)

router.get('/teachers/:id', adminController.idGroupTeachersGet)

router.get("/teachers/edit/:id", adminController.editTeachersGet)

router.post('/teachers/add', fileMiddleware.single("img"), adminController.createTeachersPost)

router.post("/teachers/edit/:id", fileMiddleware.single("img"), adminController.editTeachersPost)

router.get("/teachers/delete/:id", adminController.deleteTeachersGet)


/* +++++++++++++++++++++++++++++++++++++++ Students ++++++++++++++++++++++++++++++++++++++++++++++ */

router.get("/students", adminController.StudentsGet)

router.get("/students/search", adminController.searchStudentsGet)

router.post("/students/search", adminController.searchStudentsPost)

router.get("/students/searchBin", adminController.searchBinStudentsGet)

router.get("/students/topMarks", adminController.topStudentsGet)

//router.get("/marks/between/:start/:end", adminController.betweenMarksGet ) 

router.get('/students/add', adminController.createStudentsGet)

router.get("/students/edit/:id", adminController.editStudentsGet)

router.post('/students/add', fileMiddleware.single("img"), adminController.createStudentsPost)

router.post("/students/edit/:id", fileMiddleware.single("img"), adminController.editStudentsPost)

router.get("/students/delete/:id", adminController.deleteStudentsGet)


module.exports = router