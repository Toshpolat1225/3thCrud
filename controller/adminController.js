const Group = require('../models/Group')
const Teacher = require('../models/Teacher')
const Student = require('../models/Student')
const Search = require('../models/Search')
const Admin = require("../models/Admin")
const toDelete = require('../middleware/toDelete')
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const moment = require('moment');
//-------------------------------- Admin -------------------------------
module.exports.mainAdmin = async(req, res) => {
        const admin = await req.session.admin
        console.log(admin);
        res.render('admin/index', {
            title: 'Admin',
            layout: 'admin',
            admin
        })
    }
    //------------------------------ Profile ----------------------------
    //------------------------------- Look ------------------------------
module.exports.lookAdmin = async(req, res) => {
        const admin = await req.session.admin
        res.render('admin/lookProfile', {
            title: 'Look',
            layout: 'admin',
            admin
        })
    }
    //---------------------------- Edit Profile GET --------------------------
module.exports.editAdminGet = async(req, res) => {
        console.log(req.params.id);
        const admin = await Admin.findById(req.params.id)
        res.render('admin/editProfile', {
            layout: 'admin',
            title: 'Edit Profile',
            admin
        })
    }
    //---------------------------- Edit Profile POST -------------------------
module.exports.editAdminPost = async(req, res) => {
    //const admin = req.body;
    const admin = await req.body
    let { avatar } = await Admin.findById(req.params.id) ///---------------------------------
    if (req.file) {
        toDelete(avatar)
        avatar = req.file.filename
    } else {
        avatar = ""
    }
    const hash = await bcrypt.hash(admin.password, 10)

    admin.password = hash
    admin.avatar = avatar
    await Admin.findByIdAndUpdate(req.params.id, admin, (err) => { ///--------------------------
        console.log(err)
    })
    console.log(req.session.admin);
    req.session.admin = await admin
    console.log(req.session.admin);

    res.redirect("/admin/lookProfile")

}







//------------------------------ Groups ----------------------------

//--------------------------- All Groups GET -----------------------
module.exports.GroupsGet = async(req, res) => {
        const admin = req.session.admin
        const groups = await Group.find()
        res.render('admin/groups', {
            layout: 'admin',
            groups,
            admin
        })
    }
    //--------------------------- Add Groups GET -----------------------
module.exports.createGroupsGet = async(req, res) => {
        const admin = req.session.admin
        const teachers = await Teacher.find()
        res.render('admin/addGroup', {
            layout: 'admin',
            title: 'Create Group',
            admin,
            teachers
        })
    }
    //---------------------------- ID Groups GET -----------------------
module.exports.idGroupsGet = async(req, res) => {
        const admin = req.session.admin
        const {
            title
        } = await Group.findById(req.params.id)
        let students = await Group.aggregate([{
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "groupId",
                    as: "students"
                }
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $group: {
                    _id: {
                        _id: "$_id"
                    },
                    students: {
                        $push: "$students"
                    }
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    name: "$_id.name",
                    price: "$_id.price",
                    img: "$_id.img",
                    students: "$students"

                }
            },
            {
                $unwind: {
                    path: "$students"
                }
            },

        ])
        if (students.length) {
            students = students[0].students
        } else {
            students = ""
        }
        console.log(students);

        res.render('admin/group', {
            title: title,
            layout: 'admin',
            students,
            admin
        })
    }
    //-------------------------- Edit Groups GET -----------------------
module.exports.editGroupsGet = async(req, res) => {
        const admin = req.session.admin
        const group = await Group.findById(req.params.id)
        res.render('admin/editGroup', {
            layout: 'admin',
            title: 'Edit Group',
            group,
            admin
        })
    }
    //--------------------------- Add Groups POST -----------------------
module.exports.createGroupsPost = async(req, res) => {
    const {
        name,
        teacherId
    } = req.body
    if (req.file) {
        img = req.file.filename
    } else {
        img = ""
    }
    const group = new Group({
        name,
        img,
        teacherId
    })

    await group.save()
    res.redirect('/admin/groups')
}


///////////////////////////////

/* module.exports.createStudentsPost = async (req, res) => {
    const {
        name,
        price,
        groupId
    } = req.body
    if (req.file) {
        img = req.file.filename
    } else {
        img = ""
    }
    const student = new Student({
        name,
        price,
        img,
        groupId
    })
    await student.save()
    res.redirect('/admin/students')
} */





//--------------------------- Edit Groups POST -----------------------
module.exports.editGroupsPost = async(req, res) => {
        const {
            img
        } = await Group.findById(req.params.id)
        console.log(img)
        toDelete(img)

        const admin = req.body
        console.log(admin);


        if (req.file) {
            admin.img = req.file.filename
            toDelete(img)
        } else {
            admin.img = img
        }


        admin.img = req.file.filename
        await Group.findByIdAndUpdate(req.params.id, admin, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect("/admin/groups")
            }
        })

    }
    //--------------------------- Delete Groups GET -----------------------
module.exports.deleteGroupsGet = async(req, res) => {
    const admin = req.session.admin
    const {
        img
    } = await Group.findById(req.params.id)
    toDelete(img)
    await Group.findByIdAndDelete(req.params.id)
    res.redirect("/admin/groups")
}








//------------------------------ Teachers ----------------------------

//--------------------------- All Teachers GET -----------------------
module.exports.TeachersGet = async(req, res) => {
        const admin = req.session.admin
        const teachers = await Teacher.find()
        res.render('admin/teachers', {
            layout: 'admin',
            teachers,
            admin
        })
    }
    //--------------------------- Add Teachers GET -----------------------
module.exports.createTeachersGet = (req, res) => {
        const admin = req.session.admin
        res.render('admin/addTeacher', {
            layout: 'admin',
            title: 'Create Teacher',
            admin
        })
    }
    //---------------------------- ID Teachers GET -----------------------
module.exports.idGroupTeachersGet = async(req, res) => {
    const admin = req.session.admin
    const {
        title
    } = await Teacher.findById(req.params.id)
    let groups = await Teacher.aggregate([{
            $lookup: {
                from: "groups",
                localField: "_id",
                foreignField: "teacherId",
                as: "groups"
            }
        },
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $group: {
                _id: {
                    _id: "$_id"
                },
                groups: {
                    $push: "$groups"
                }
            }
        },
        {
            $project: {
                _id: "$_id._id",
                name: "$_id.name",
                img: "$_id.img",
                groups: "$groups"

            }
        },
        {
            $unwind: {
                path: "$groups"
            }
        },

    ])
    if (groups.length) {
        groups = groups[0].groups
    } else {
        groups = ""
    }
    console.log(groups);

    res.render('admin/teacher', {
        title: title,
        layout: 'admin',
        groups,
        admin
    })
}


//-------------------------- Edit Teacher GET -----------------------
module.exports.editTeachersGet = async(req, res) => {
        const admin = req.session.admin
        const teacher = await Teacher.findById(req.params.id)
        res.render('admin/editTeacher', {
            layout: 'admin',
            title: 'Edit Teacher',
            teacher,
            admin
        })
    }
    //--------------------------- Add Teachers POST -----------------------
module.exports.createTeachersPost = async(req, res) => {
        const {
            name
        } = req.body
        if (req.file) {
            img = req.file.filename
        } else {
            img = ""
        }
        const teacher = new Teacher({
            name,
            img
        })

        await teacher.save()
        res.redirect('/admin/teachers')
    }
    //--------------------------- Edit Teachers POST -----------------------
module.exports.editTeachersPost = async(req, res) => {
        const {
            img
        } = await Teacher.findById(req.params.id)
        console.log(img)
        toDelete(img)

        const admin = req.body
        console.log(admin);


        if (req.file) {
            admin.img = req.file.filename
            toDelete(img)
        } else {
            admin.img = img
        }


        admin.img = req.file.filename
        await Teacher.findByIdAndUpdate(req.params.id, admin, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect("/admin/teachers")
            }
        })

    }
    //--------------------------- Delete Teachers GET -----------------------
module.exports.deleteTeachersGet = async(req, res) => {
    const admin = req.session.admin
    const {
        img
    } = await Teacher.findById(req.params.id)
    toDelete(img)
    await Teacher.findByIdAndDelete(req.params.id)
    res.redirect("/admin/teachers")
}









//------------------------------ Students --------------------------------

//--------------------------- All Students GET ---------------------------
module.exports.StudentsGet = async(req, res) => {
        const admin = req.session.admin
        const students = await Student.find()
        for (i = 0; i < students.length; i++) {
            console.log(students[i].name)
        }
        res.render("admin/students", {
            layout: "admin",
            title: "Drug models",
            students,
            admin
        })
    }
    //--------------------------- Search Students GET ---------------------------
module.exports.searchStudentsGet = async(req, res) => {
        const admin = req.session.admin
        const students = await Student.find()
        res.render("admin/search", {
            layout: "admin",
            title: "Drug models",
            students,
            admin
        })




    }
    //--------------------------- Search Students Post ---------------------------
module.exports.searchStudentsPost = async(req, res) => {
        const { bin } = req.body
        const search = new Search({
            bin
        })
        await search.save()
        console.log(search)
        res.redirect('/admin/students/searchBin')
        console.log(search)
    }
    //--------------------------- SearchBin Students GET ---------------------------
module.exports.searchBinStudentsGet = async(req, res) => {
        console.log('searchBinStudentsGet')
        const admin = req.session.admin
        const search = await Search.find()
        const students = await Student.find()

        for (i = 0; i < students.length; i++) {

            console.log(students[i].name + " 272")
            console.log(Object.values(search)[0])
            console.log(search.bin + "274")
            if (search.bin == students[i].name) {
                await Search.findByIdAndDelete() //req.params.id
                res.render("admin/searchBin", {
                    layout: "admin",
                    title: "Student search",
                    students,
                    admin
                })

            }

        }

    }
    //--------------------------- Top Students GET ---------------------------
module.exports.topStudentsGet = async(req, res) => {
    const admin = req.session.admin
    const students = await Student.find().sort({ price: -1 }).limit(13)
    res.render("admin/topStudents", {
        layout: "admin",
        title: "Students Top",
        students,
        admin
    })
}

//--------------------------- Between Marks GET ---------------------------
//module.exports.betweenMarksGet = async (req, res) => {
//    const admin = req.session.admin
//    const {start, end} = req.params
//    const marks = await Mark.find(
//        {price: {$gte:parseInt(start),$lte:parseInt(end)}}
//    )
//    res.render("admin/marks/top", { ////// top
//        layout: "admin",
//        title: "Drug models Top",
//        marks,
//        admin
//    })
//}


//---------------------------- Add Students GET ---------------------------
module.exports.createStudentsGet = async(req, res) => {
        const admin = req.session.admin
        const groups = await Group.find()
        const teachers = await Teacher.find()
        res.render('admin/addStudent', {
            layout: 'admin',
            title: 'Create Student',
            teachers,
            groups,
            admin
        })
    }
    //---------------------------- Edit Students GET --------------------------
module.exports.editStudentsGet = async(req, res) => {
        const admin = req.session.admin
        const student = await Student.findById(req.params.id)
        const groups = await Group.find()
        console.log(groups);
        res.render('admin/editStudent', {
            layout: 'admin',
            title: 'Edit Student',
            student,
            groups,
            admin
        })
    }
    //---------------------------- Add Students POST --------------------------
module.exports.createStudentsPost = async(req, res) => {
        const {
            name,
            price,
            groupId
        } = req.body
        if (req.file) {
            img = req.file.filename
        } else {
            img = ""
        }
        const student = new Student({
            name,
            price,
            img,
            groupId
        })
        await student.save()
        res.redirect('/admin/students')
    }
    //---------------------------- Edit Students POST -------------------------
module.exports.editStudentsPost = async(req, res) => {
        const {
            img
        } = await Student.findById(req.params.id)
        toDelete(img)
        const admin = req.body
        if (req.file) {
            admin.img = req.file.filename
            toDelete(img)
        } else {
            admin.img = img
        }
        admin.img = req.file.filename
        await Student.findByIdAndUpdate(req.params.id, admin, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.redirect("/admin/students")
            }
        })
    }
    //---------------------------- Delete Students GET ------------------------
module.exports.deleteStudentsGet = async(req, res) => {
    const admin = req.session.admin
    const {
        img
    } = await Student.findById(req.params.id)
    toDelete(img)
    await Student.findByIdAndDelete(req.params.id)
    res.redirect("/admin/students")
}