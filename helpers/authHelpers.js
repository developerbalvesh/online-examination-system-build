const bcryptjs = require('bcryptjs')

const hashPassword=async(password)=>{
    try {
        const saltRounds = 10;
        const hashedPassword=await bcryptjs.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error)
    }
}

const comparePassword=async(password, hashedPassword)=>{
    return await bcryptjs.compare(password, hashedPassword)
}

module.exports = {hashPassword, comparePassword}