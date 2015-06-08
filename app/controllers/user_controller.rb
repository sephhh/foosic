class UserController < WebsocketRails::BaseController

  def set_username
    username = ["Big-","Sleepy-","Lugubrious-"].sample + ["Jammer-","Rocker-","Wailer-"].sample + rand(0..100).to_s
    connection_store[:username] = username
    send_message :set_username, username
  end

end
