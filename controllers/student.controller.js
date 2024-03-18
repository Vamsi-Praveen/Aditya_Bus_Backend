import Student from "../models/student.model.js";

export const addStudent = async (req, res) => {
    try {
        const { firstname, lastname, email, rollno, college, branch, year, semester, phoneNumber, cityName, busRoute,passout,busfee } = req.body;
        
        //check weather the student exists or not
        const isStudentExists = await Student.exists({ rollno: rollno });
        if (!isStudentExists) {
            const student = new Student({
                firstname: firstname,
                lastname: lastname,
                college: college,
                branch: branch,
                rollno: rollno,
                phoneNumber: phoneNumber,
                email: email,
                year: year,
                semester: semester,
                passout:passout,
                busfee:busfee,
                cityName: cityName,
                busRoute: busRoute,
            });
            await student.save().then((data) => {
                return res.status(201).send({
                    success: 1, data: data
                })
            }).catch((err) => {
                return res.status(500).send({ ErrorMessage: "Internal Server Error", error: err })
            })
        }
        else {
            return res.status(400).send("Student Already Exists")
        }
    }
    catch (error) {
        return res.status(500).send({ Error: "Internal Server Error", error: error })
    }
}




export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const isStudentExists = await Student.exists({ rollno: id });
        if (isStudentExists) {
            await Student.findOneAndDelete({ rollno: id })
                .then((data) => {
                    return res.status(200).send({ success: 1, deletedData: data });
                })
                .catch((err) => {
                    return res.status(500).send({ ErrorMessage: "Internal Server Error", error: err })

                })
        }
        else {
            return res.status(404).send("No Student Exists")
        }
    }
    catch (err) {
        return res.status(500).send({ ErrorMessage: "Internal Server Error", error: err })

    }
}