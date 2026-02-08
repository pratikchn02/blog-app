  const User = require("../models/user")

async function createUser (req, res) {
  const { name, password, email } = req.body || {};
  // console.log(req.body)
  try {
    if (!name ) {
      return res.status(400).json({
        success: false,
        message: "please fill name",
      });
    }
    if (!password ) {
      return res.status(400).json({
        success: false,
        message: "please fill password",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "please fill email",
      });
    }

    const checkForExistingUser = await User.findOne({email})
    if(checkForExistingUser){
      return res.status(400).json({
        success: false,
      message: "User already registered with this email",
      })
    }

    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });

    return res.status(200).json({
      success: true,
      message: "everything is okay",
      newUser,
      checkForExistingUser
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "please try again",
      erorr :  err.message
    });
  }
}

async function getAllUsers(req, res)  {
  try {
    //db call
    const users = await User.find({})

    return res.status(200).json({
      Success: true,
      message: "users fetched succesfully",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "error occures in get",
    });
  }
}

async function getUserByID (req, res)  {
  try {
    //db call
    const id = req.params.id


    const user = await User.findById(id)
    console.log(user)
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      Success: true,
      message: "users fetched succesfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "error occures in get",
      error : err.message
    });
  }
}

async function updateUser(req, res)   {
  
  try {
    //db call
    const id = req.params.id
    const {name ,password , email} = req.body
    const updatedUser= await User.findByIdAndUpdate(id, {name , password , email})
    console.log(updatedUser)

    // const updatedUsers = users.map((user) =>
    //   user.id == id ? { ...user, ...req.body } : user,
    // );
    // users = updatedUsers;
    return res.json({ message: "user data updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "error occured" });
  }
}

 async function deleteUser(req, res)  {
  
  try {
    const id = req.params.id
    
    const deleteUser= await User.findByIdAndDelete(id)
    console.log(deleteUser)
    if(!deleteUser){
      return res.json({message : "User not found"})
    }

    return res.json({ message: "users deleted successfully"});
  } catch (err) {
    return res.status(500).json({ message: "error occured" });
  }
}

module.exports= {createUser , getAllUsers , getUserByID , updateUser , deleteUser}