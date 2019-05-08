class UserAPI {
  constructor(userController, auth) {
    this.userController = userController;
    this.auth = auth;
  }

  async getByID(req, res, next) {
    try {
      const authenticated = await this.auth.authenticate(req, res, next);
      if (authenticated) {
        const id = req.params.id;
        const user = await this.userController.getByID(id);
        res.status(200).send(user);
      }
    } catch (e) {
      return false;
    }
  }

  async create(req, res, next) {
    const body = { ...req.body };

    const userInfo = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      municipality: body.municipality,
      userType: body.userType
    };

    let userContext, skills;

    switch (true) {
      case userInfo.userType === "company":
        userContext = {
          name: body.name,
          webpage: body.webpage,
          registrationCode: body.registrationCode,
          orgNumber: body.orgNumber,
          ...userInfo
        };
        break;

      case userInfo.userType === "employee":
        userContext = {
          role: body.role,
          skills: body.skills,
          ...userInfo
        };
        break;
      case userInfo.userType === "jobseeker":
        userContext = {
          type: body.type,
          education: body.education,
          skills: body.skills,
          ...userInfo
        };
        break;
      default:
        //  error: no usertype given
        break;
    }

    const passwordHash = await this.auth.hash(body.password);

    try {
      await this.userController.create(userContext, passwordHash);

      res.status(200).send({
        success: true,
        message: "User created"
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        message: `Error when creating user: ${e}`
      });
    }
  }

  async updateProfile(req, res, next) {
    //  Authenticate user and decode token
    let token;
    try {
      token = await this.auth.authenticate(req, res, next);
      if (!token) {
        res.status(401).send({
          success: false,
          message: "Not logged in with a valid token"
        });
        return false;
      }
    } catch (e) {
      return false;
    }

    //  Get id of the user that is to be modified
    const userId = req.params.id;

    //  Make sure that users only modify their own profiles
    if (userId !== token.sub) {
      res.status(403).send({
        success: false,
        message: "Not allowed to edit another user's profile"
      });

      return false;
    }

    //  Values to be updated
    const userContext = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      description: req.body.description,
      id: userId
    };

    //  Attempt to do update profile
    try {
      const success = await this.userController.updateProfile(userContext);

      if (success) {
        res.status(200).send({
          success: true,
          message: "Successful profile update"
        });

        return true;
      }

      res.status(500).send({
        success: false,
        message: "Unknown error when updating profile"
      });

      return false;
    } catch (e) {
      res.status(500).send({
        success: false,
        message: `Error when updating profile: ${e}`
      });

      return false;
    }
  }

  async contact(req, res, next) {
    const contactee = parseInt(req.params.id);

    if(isNaN(contactee)){
      res.status(500).send({
        success: false,
        message: "ID must be a integer"
      });
      return;
    }

    let contacter;
    try {
      const authenticated = await this.auth.authenticate(req, res, next);
      contacter = authenticated.sub;


      if(contacter === contactee){
        res.status(500).send({
          success: false,
          message: "You can't connect with yourself"
        });
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        message: "Authentication failed"
      });
      return;
    }



    try {
      const hasContacted = await this.userController.hasContactOnOneSide(
        contacter,
        contactee
      );

      if (hasContacted) {
        res.status(500).send({
          success: false,
          message: "The contacter has already requested the contactee"
        });
        return;
      }
    } catch (e) {
      res.status(500).send({
        success: false,
        message: `Error when contacting: ${e}`
      });
      return;
    }

    try {
      await this.userController.createContact(contacter, contactee);

      res.status(200).send({
        success: true,
        message: ""
      });
    } catch (e) {
      res.status(500).send({
        success: false,
        message: "Could not create a contact"
      });
    }
  }

}

module.exports = UserAPI;
