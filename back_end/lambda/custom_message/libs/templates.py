from jinja2 import Environment as JEnvironment
from jinja2 import FileSystemLoader

def confirm_new_account_template(url):
  env = JEnvironment(loader=FileSystemLoader("/var/task/templates/"))
  template = env.get_template("confirm_new_account.html")
  html = template.render(url=url)
  return html

def forgot_password_template(url):
  env = JEnvironment(loader=FileSystemLoader("/var/task/templates/"))
  template = env.get_template("reset_password.html")
  html = template.render(url=url)
  return html