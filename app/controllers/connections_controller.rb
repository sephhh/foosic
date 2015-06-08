class ConnectionsController < WebsocketRails::BaseController

  def get_online_users
    users = connection_store.collect_all(:username)
    users.delete(connection_store[:username])
    if users.size > 0
      trigger_success users
    end
  end

end
