class BoardsController < ApplicationController

  def index
    if user_signed_in?
      @boards = Board.where("user_id = ? OR user_id IS NULL", current_user.id)
    else
      @boards = Board.where("user_id IS NULL")
    end
    respond_to do |format|
      format.json {render json: @boards}
    end 
  end

  def show
  end

  def lookup
    @board = Board.find(params[:id])
    respond_to do |format|
      format.json {render json: @board.get_samples}
    end 
  end

  def create
  end

end
