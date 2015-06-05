class SamplesController < ApplicationController

  def index
    @samples = Sample.all
    respond_to do |format|
      format.json {render json: @samples}
      format.html {}
    end 
  end

  def new
    unless user_signed_in?
      redirect_to new_user_session_path, :alert => "You must be logged in to create a sample."
    end
  end

end
