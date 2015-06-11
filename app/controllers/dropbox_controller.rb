class DropboxController < ApplicationController

  require 'dropbox_sdk'
  require 'securerandom'

  def has_token?
    @response = !!get_dropbox_client
    respond_to do |format|
      format.json {render json: {has_token: @response}.to_json}
    end
  end

  def redirect_to_main
    url = "https://tyutyube.herokuapp.com/dropbox/main?dont_worry_about_me=#{current_user.id}"
    redirect_to url
  end

  def main
    session[:dont_worry_about_me] = params[:dont_worry_about_me]
    redirect_to(:action => 'auth_start')
  end

  def upload
    client = get_dropbox_client
    unless client
      redirect_to(:action => 'auth_start') and return
    end

    begin
      # Upload the POST'd file to Dropbox, keeping the same name
      resp = client.put_file(params[:filename], params[:file].read)

      new_session = DropboxOAuth2Session.new(session[:access_token], nil)
      response = new_session.do_get "/shares/auto/#{client.format_path(resp["path"])}", {"short_url"=>false}
      url = Dropbox::parse_response(response)["url"]
      url.gsub!("https://www", "https://dl")
      Sample.create(name: params[:filename], user_id: current_user.id, url: url)
      render :text => "Upload successful.  File now at #{resp['path']}"
    rescue DropboxAuthError => e
      session.delete(:access_token)  # An auth error means the access token is probably bad
      logger.info "Dropbox auth error: #{e}"
      render :text => "Dropbox auth error"
    rescue DropboxError => e
      logger.info "Dropbox API error: #{e}"
      render :text => "Dropbox API error"
    end
  end

  def get_dropbox_client
    if access_token = current_user.dropbox_token
      begin
        DropboxClient.new(access_token)
      rescue
        # Maybe something's wrong with the access token?
        session.delete(:access_token)
        raise
      end
    end
  end

  def get_web_auth()
    redirect_uri = url_for(:action => 'auth_finish')
    DropboxOAuth2Flow.new(ENV['APP_KEY'], ENV['APP_SECRET'], redirect_uri, session, :dropbox_auth_csrf_token)
  end

  def auth_start
    authorize_url = get_web_auth().start()

    # Send the user to the Dropbox website so they can authorize our app.  After the user
    # authorizes our app, Dropbox will redirect them here with a 'code' parameter.
    redirect_to authorize_url
  end

  def auth_finish
    begin
      access_token, user_id, url_state = get_web_auth.finish(params)
      me = User.find(session[:dont_worry_about_me])
      me.dropbox_token = access_token
      me.save
      session[:access_token] = access_token
      redirect_to 'http://www.tyutyu.be'
    rescue DropboxOAuth2Flow::BadRequestError => e
      render :text => "Error in OAuth 2 flow: Bad request: #{e}"
    rescue DropboxOAuth2Flow::BadStateError => e
      logger.info("Error in OAuth 2 flow: No CSRF token in session: #{e}")
      redirect_to(:action => 'auth_start')
    rescue DropboxOAuth2Flow::CsrfError => e
      logger.info("Error in OAuth 2 flow: CSRF mismatch: #{e}")
      render :text => "CSRF error"
    rescue DropboxOAuth2Flow::NotApprovedError => e
      render :text => "Not approved?  Why not, bro?"
    rescue DropboxOAuth2Flow::ProviderError => e
      logger.info "Error in OAuth 2 flow: Error redirect from Dropbox: #{e}"
      render :text => "Strange error."
    rescue DropboxError => e
      logger.info "Error getting OAuth 2 access token: #{e}"
      render :text => "Error communicating with Dropbox servers."
    end
  end
end
