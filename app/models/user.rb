class User < ApplicationRecord
  validates :user_name, presence: true
  validates :public_key, presence: true
end
