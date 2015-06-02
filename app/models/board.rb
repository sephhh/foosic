class Board < ActiveRecord::Base
  has_many :samples

  def letters
    ["T", "Y", "U", "G", "H", "J", "B", "N", "M"] 
  end
end
