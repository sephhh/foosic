class UserController < WebsocketRails::BaseController

  def set_username
    username = [["BIG","TURNT","LAZY","SLEEPY","TINY"].sample,["STOMPER","JAMMER","ROCKER","WAILER"].sample,rand(0..100).to_s].join("-")
    connection_store[:username] = username
    send_message :set_username, username
  end

end
