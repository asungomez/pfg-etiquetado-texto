class GeneralException(Exception):

    def __init__(self, msg, original_exception=None):

        """
        Default constructor. Creates a Wazuh Cloud exception.

        :param msg: Exception message.
        :param original_exception: Original exception message.
        """

        self.full_msg = "'{}'. ".format(msg)

        if original_exception is not None:
            self.full_msg = self.full_msg + "Exception: '{}'.".format(original_exception)
            self.original_exception = original_exception

        super(GeneralException, self).__init__(self.full_msg)


class APIException(GeneralException):

    def __init__(self, code, msg, original_exception=None):

        """
        Creates an exception related to the Account model.

        :param code: Exception code.
        :param msg: Exception message.
        :param original_exception: Original exception message.
        """

        self.code = code
        self.code_description = self.ERRORS.get(code, "Unexpected error")
        self.msg = msg
        self.original_exception = original_exception
        self.full_msg = "Cloud API Exception - {} - {}: '{}'"\
            .format(self.code, self.code_description, self.msg)

        super(APIException, self).__init__(self.full_msg, self.original_exception)

    ERRORS = {
        400: "Input error",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Resource not found",
        422: "Unprocessable Entity",
        429: "Too many requests",
        500: "Error"
    }