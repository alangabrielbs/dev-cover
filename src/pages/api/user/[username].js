import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  const {
    query: { username },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return res.status(400).json({ success: false });
        }
        return res.status(200).json({ success: true, data: user });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

    case 'PUT' /* Edit a model by its ID */:
      try {
        const { body: userBody } = req;
        // Make sure this account doesn't already exist
        const userExists = await User.findOne({
          username,
        });
        if (!userExists) {
          return res.status(400).json({ success: false, message: 'User does not exists' });
        }
        await userExists.updateOne(userBody);
        return res.status(200).json({ success: true, data: userExists });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    default:
      return res.status(400).json({ success: false });
  }
}
