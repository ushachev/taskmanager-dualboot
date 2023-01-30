admin = Admin.find_or_create_by(first_name: 'admin', last_name: 'admin', email: 'admin@localhost.ru')
admin.password = 'admin'
admin.save

60.times do |i|
  u = [Manager, Developer].sample.new
  u.email = "email#{i}@mail.gen"
  u.first_name = "FN#{i}"
  u.last_name = "LN#{i}"
  u.password = "#{i}"
  u.save
end

25.times do |i|
  t = Task.new
  t.name = "task name TN#{i}"
  t.description = "task description TD#{i}"
  t.state = 'new_task'
  t.author = Developer.first
  t.save
end
