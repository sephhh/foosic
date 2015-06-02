class SamplesController < ApplicationController

  def index
    @samples = Sample.all
    respond_to do |format|
      format.json {render json: @samples}
      format.html {}
    end 
  end

end
