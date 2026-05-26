const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.post("/signup", async (req, res) => {
  try {
    const { username, mobile } = req.body;

    if (!username || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          mobile
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: "Signup Successful",
      user: data[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
