class Types::EmployeeType < Types::BaseObject
  field "id", ID
  field "display_name", String, method: :displayName
  field "is_photo_uploaded", String, method: :isPhotoUploaded
  field "photo_url", String, method: :photoUrl
end
