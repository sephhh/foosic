class ConnectionsController < WebsocketRails::BaseController
  def hello
    send_message :private, "hi"
  end

  def respond
    WebsocketRails[:public].trigger 'update', "hello, #{message}"
  end
end
