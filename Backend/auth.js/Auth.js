import Auth from "../models/auth.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



// SIGN UP CONTROLLER
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Each field is compulsory" });
    }

    // Check if user already exists
    const isExist = await Auth.findOne({ email });

    if (isExist) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new Auth({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // // Generate JWT token (optional)
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });

    res.status(201).json({
      msg: "User registered successfully",
      // token, // Optional
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// LOGIN CONTROLLER
export const Login = async (req, res) => {
  try {
    console.log("Login ROute hit")
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Each field is compulsory" });
    }

    const isExist = await Auth.findOne({ email });

    if (!isExist) {
      return res.status(404).json({ msg: "No user found with this email" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, isExist.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: isExist._id, email: isExist.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
     
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ msg: "Logged in successfully",
      token
     });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error while logging in" });
  }
};


// LOGOUT OPTION
export const Logout = async (req, res) => {
  try {
    // Clear the cookie that stores the token
    res.clearCookie("token", {
        httpOnly:true,
        secure:false,
        path:"/"
    });

    return res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({ msg: "Server error during logout" });
  }
};




// CHANGE PASSWORD OPTION
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' })
    }

    const user = await Auth.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(401).json({ msg: 'Current password is incorrect' })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    return res.status(200).json({ msg: 'Password changed successfully' })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ msg: 'Server error' })
  }
}
