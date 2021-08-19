from libs.templates import confirm_new_account_template, forgot_password_template
import os

def handler(event, context):
  event_type = event["triggerSource"]

  # Regular sign up and resend confirmation code requests
  if event_type in ["CustomMessage_SignUp", "CustomMessage_ResendCode"]:
    code_parameter = event["request"]["codeParameter"]
    email = event["request"]["userAttributes"]["email"]
    client_id = event["callerContext"]["clientId"]
    url = f"{os.environ['APP_BASE_URL']}//accounts/validate?code={code_parameter}&email={email}&id={client_id}"
    event["response"]["emailSubject"] = "Confirma tu cuenta"
    event["response"]["emailMessage"] = confirm_new_account_template(url)

  # Forgot my password requests
  if event_type == "CustomMessage_ForgotPassword":
    email = event["request"]["userAttributes"]["email"]
    code_parameter = event["request"]["codeParameter"]
    url = f"{os.environ['APP_BASE_URL']}/recuperar-contrasena?code={code_parameter}&email={email}"
    event["response"]["emailSubject"] = "Restaurar contraseña"
    event["response"]["emailMessage"] = forgot_password_template(url)

  return event