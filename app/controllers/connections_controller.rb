class ConnectionsController < WebsocketRails::BaseController

  def get_online_users
    users = connection_store.collect_all(:username)
    users.delete(connection_store[:username])
    if users.size > 0
      trigger_success users
    end
  end

  def request_connection
    WebsocketRails[message[:receiver]].trigger 'connection_requested', message
  end

  def accept_connection
    WebsocketRails[message[:sender]].trigger 'connection_accepted', message
  end

  def reject_connection
    WebsocketRails[message[:sender]].trigger 'connection_rejected', message
  end

end
